import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';
import Estimate from '#models/estimate';
import Project from '#models/project';
import User from '#models/user';

export type CreateProjectRequest = {
  creatorEmail: string;
  clientEmail?: string;
  title: string;
  description?: string;
  notes?: string;
  architect?: string;
  estimates: {
    title: string;
    architect: string;
    status: string;
    date: string;
    salesTax: number;
    generalContractorEmail: string;
    clientEmail: string;
    items: {
      name: string;
      ppu: number;
      quantity: number;
    }[];
    labors: {
      name: string;
      ppu: number;
      quantity: number;
      unitOfMeasure: string;
    }[];
  }[];
};

const addSortField = (list: Record<string, unknown>[]): Record<string, unknown>[] =>
  list.map((item, index) => {
    item.sort = index;
    return item;
  });

export default class ProjectService {
  async getSingleProject(id: string) {
    const project = await Project.findOrFail(id);
    await project.load('estimates', (query) =>
      query
        .preload('client')
        .preload('generalContractor')
        .preload('items')
        .preload('labors')
        .orderBy('createdAt'),
    );
    await project.load('creator');
    await project.load('workers');
    return project;
  }

  async create(body: CreateProjectRequest) {
    const trx = await db.transaction();

    const user = await User.findByOrFail({ email: body.creatorEmail }, { client: trx });
    const estimateList = body.estimates;

    const project = await Project.create(
      {
        creatorId: user.id,
        title: body.title,
        description: body.description,
        notes: body.notes,
      },
      { client: trx },
    );
    if (body.clientEmail) {
      const client = await User.findByOrFail({ email: body.clientEmail }, { client: trx });
      await project.related('client').associate(client);
    }
    await project.related('workers').attach({ [user.id]: { type: 'primary' } });

    for (const estimateRequest of estimateList) {
      const client = await User.findByOrFail(
        { email: estimateRequest.clientEmail },
        { client: trx },
      );
      const generalContractor = await User.findByOrFail(
        {
          email: estimateRequest.generalContractorEmail,
        },
        { client: trx },
      );

      const estimate = await Estimate.create(
        {
          architect: estimateRequest.architect,
          date: DateTime.now(),
          salesTax: estimateRequest.salesTax,
          status: estimateRequest.status,
          title: estimateRequest.title,
        },
        { client: trx },
      );

      await estimate.related('projectProject').associate(project);
      await estimate.related('client').associate(client);
      await estimate.related('generalContractor').associate(generalContractor);

      await estimate
        .related('labors')
        .createMany(addSortField(estimateRequest.labors), { client: trx });
      await estimate
        .related('items')
        .createMany(addSortField(estimateRequest.items), { client: trx });

      await estimate.save();
    }

    await project.save();
    await trx.commit();

    await project.load('estimates');
    return project;
  }
}

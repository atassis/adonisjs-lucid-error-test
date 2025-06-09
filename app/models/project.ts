import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations';
import type { DateTime } from 'luxon';
import Estimate from './estimate.js';
import User from './user.js';

export enum ProjectStatus {
  ESTIMATE = 'ESTIMATE',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  HOLD = 'HOLD',
}

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column({ serializeAs: null })
  declare creatorId: string;

  @belongsTo(() => User, { foreignKey: 'creatorId' })
  declare creator: BelongsTo<typeof User>;

  @column()
  declare title: string;

  @column()
  declare notes: string;

  @column()
  declare description: string;

  @column()
  declare status: ProjectStatus;


  @column({ serializeAs: null })
  declare clientId: number;

  @belongsTo(() => User, { foreignKey: 'clientId' })
  declare client: BelongsTo<typeof User>;

  @manyToMany(() => User, {
    pivotTable: 'project_users',
    pivotColumns: ['type'],
    pivotTimestamps: true,
  })
  declare workers: ManyToMany<typeof User>;

  @hasMany(() => Estimate, { foreignKey: 'projectId' })
  declare estimates: HasMany<typeof Estimate>;
}

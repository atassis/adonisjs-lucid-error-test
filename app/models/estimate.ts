import { randomUUID } from 'node:crypto';
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import Item from './item.js';
import Labor from './labor.js';
import Project from './project.js';
import User from './user.js';

export default class Estimate extends BaseModel {
  static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  declare id: string;

  @beforeCreate()
  static assignUuid(estimate: Estimate) {
    estimate.id = randomUUID();
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column()
  declare title: string;

  @column()
  declare architect: string;

  @column()
  declare status: string;

  @column.dateTime()
  declare date: DateTime;

  @column()
  declare salesTax: number;

  @column({ serializeAs: null })
  declare generalContractorId: string;

  @belongsTo(() => User, { foreignKey: 'generalContractorId' })
  declare generalContractor: BelongsTo<typeof User>;

  @column({ serializeAs: null })
  declare clientId: string;

  @belongsTo(() => User, { foreignKey: 'clientId' })
  declare client: BelongsTo<typeof User>;

  @column({ serializeAs: null })
  declare projectId: string;

  @belongsTo(() => Project, { foreignKey: 'projectId' })
  declare project: BelongsTo<typeof Project>;

  @hasMany(() => Item, { foreignKey: 'estimateId' })
  declare items: HasMany<typeof Item>;

  @hasMany(() => Labor, { foreignKey: 'estimateId' })
  declare labors: HasMany<typeof Labor>;
}

import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import type { DateTime } from 'luxon';

import Estimate from './estimate.js';

export default class Labor extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column({ serializeAs: null })
  declare estimateId: string;

  @belongsTo(() => Estimate)
  declare estimate: BelongsTo<typeof Estimate>;

  @column()
  declare name: string;

  @column()
  declare ppu: number;

  @column()
  declare quantity: number;

  @column()
  declare sort: number;

  @column()
  declare unitOfMeasure: string;
}

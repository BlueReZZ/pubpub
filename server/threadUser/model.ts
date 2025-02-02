import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	IsLowercase,
	IsEmail,
	AllowNull,
	BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../models';

@Table
class ThreadUser extends Model<InferAttributes<ThreadUser>, InferCreationAttributes<ThreadUser>> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Default('viewer')
	@Column(DataType.ENUM('viewer', 'reviewer'))
	// 	type?: CreationOptional<string | null>;
	type?: any;

	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	email?: string | null;

	@Column(DataType.TEXT)
	hash?: string | null;

	@Column(DataType.UUID)
	userId?: string | null;

	@AllowNull(false)
	@Column(DataType.UUID)
	threadId!: string;

	@BelongsTo(() => User, { onDelete: 'CASCADE', as: 'user', foreignKey: 'userId' })
	// 	user?: User;
	user?: any;
}

export const ThreadUserAnyModel = ThreadUser as any;

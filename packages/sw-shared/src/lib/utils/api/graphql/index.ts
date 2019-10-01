import * as graphql from 'type-graphql';
import { wrapDecorator } from '@shared/lib/utils/functions';

export const Int = graphql.Int;
export const ID = graphql.ID;
export const ObjectType = wrapDecorator(graphql.ObjectType);
export const Field = wrapDecorator(graphql.Field);
export const registerEnumType = wrapDecorator(graphql.registerEnumType);

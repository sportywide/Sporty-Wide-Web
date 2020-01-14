import {
	createReducer as originalCreateReducer,
	createStandardAction,
	EmptyAC,
	PayloadMetaAction,
	TypeConstant,
} from 'typesafe-actions';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { Action, Reducer, Types } from 'typesafe-actions/dist/type-helpers';

export function createSwStandardAction(actionType: string | symbol): SwActionBuilder {
	return createStandardAction(actionType as string) as any;
}

export interface SwActionBuilder {
	<P = undefined, M = SwMeta>(): ActionBuilderConstructor<string, P, M & SwMeta>;
	map<R, P = undefined, M = SwMeta>(fn: (payload: P, meta: M) => R): ActionBuilderMap<string, R, P, M & SwMeta>;
}

interface SwMeta {
	user?: IUser;
}

export const createReducer = originalCreateReducer as CreateReducer;

declare type ActionBuilderMap<
	TType extends TypeConstant,
	TActionProps extends any,
	TPayloadArg extends any = undefined,
	TMetaArg extends any = undefined
> = [TMetaArg] extends [undefined]
	? [TPayloadArg] extends [undefined]
		? () => {
				type: TType;
		  } & TActionProps
		: (
				payload: TPayloadArg
		  ) => {
				type: TType;
		  } & TActionProps
	: (
			payload: TPayloadArg,
			meta?: TMetaArg
	  ) => {
			type: TType;
	  } & TActionProps;

declare type PayloadMetaAC<TType extends TypeConstant, TPayload, TMeta> = (
	payload: TPayload,
	meta?: TMeta
) => PayloadMetaAction<TType, TPayload, TMeta>;

declare type ActionBuilderConstructor<
	TType extends TypeConstant,
	TPayload extends any = undefined,
	TMeta extends any = undefined
> = [TPayload] extends [undefined] ? EmptyAC<TType> : PayloadMetaAC<TType, TPayload, TMeta>;

declare type RootAction = Types extends {
	RootAction: infer T;
}
	? T
	: any;

declare type GetAction<TAction extends Action, TType extends TAction['type']> = TAction extends Action<TType>
	? TAction
	: never;

declare type InitialHandler<TState, TRootAction extends Action> = {
	[P in TRootAction['type']]?: (state: TState, action: GetAction<TRootAction, P>) => TState;
};

declare interface CreateReducer {
	<TState, TRootAction extends Action = RootAction>(
		initialState: TState,
		initialHandlers?: InitialHandler<TState, TRootAction>
	): Reducer<TState, TRootAction> & {
		readonly handlers: any;
		readonly handleAction: SwHandleChain<TState, TRootAction, TRootAction>;
	};
}

declare type SwHandleChain<TState, TCurrentAction extends Action, TRootAction extends Action> = <
	TType extends TCurrentAction['type'],
	TCreator extends (...args: any[]) => TCurrentAction,
	TNextAction extends TCurrentAction,
	TAction extends ReturnType<TCreator>
>(
	singleOrMultipleCreatorsAndTypes: TType | TType[] | TCreator | TCreator[],
	reducer: (state: TState, action: TAction) => TState
) => Reducer<TState, TRootAction> & {
	handlers: Record<TRootAction['type'], (state: TState, action: TRootAction) => TState>;
	handleAction: SwHandleChain<TState, TNextAction, TRootAction>;
};

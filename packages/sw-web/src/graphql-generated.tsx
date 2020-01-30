import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};

export type AddressDto = {
   __typename?: 'AddressDto',
  id: Scalars['Int'],
  street1?: Maybe<Scalars['String']>,
  street2?: Maybe<Scalars['String']>,
  state?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  suburb?: Maybe<Scalars['String']>,
  postcode?: Maybe<Scalars['String']>,
  lat?: Maybe<Scalars['Int']>,
  lon?: Maybe<Scalars['Int']>,
};


export type Query = {
   __typename?: 'Query',
  users: Array<UserDto>,
  user: UserDto,
  teams: TeamPaginationResult,
  team: TeamDto,
};


export type QueryUsersArgs = {
  limit?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>
};


export type QueryUserArgs = {
  id: Scalars['Float']
};


export type QueryTeamsArgs = {
  limit?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>,
  filter?: Maybe<TeamListFilteredDto>
};


export type QueryTeamArgs = {
  id: Scalars['Float']
};

export type TeamDto = {
   __typename?: 'TeamDto',
  id: Scalars['Int'],
  name: Scalars['String'],
  image: Scalars['String'],
  title: Scalars['String'],
  leagueId: Scalars['Int'],
  league: Scalars['String'],
  att: Scalars['Int'],
  mid: Scalars['Int'],
  def: Scalars['Int'],
  ovr: Scalars['Int'],
  rating: Scalars['String'],
};

export type TeamListFilteredDto = {
  leagueId?: Maybe<Array<Scalars['Int']>>,
  search?: Maybe<Scalars['String']>,
};

export type TeamPaginationResult = {
   __typename?: 'TeamPaginationResult',
  items: Array<TeamDto>,
  count: Scalars['Int'],
};

export type UserDto = {
   __typename?: 'UserDto',
  id: Scalars['Int'],
  firstName: Scalars['String'],
  lastName?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  username: Scalars['String'],
  role: UserRole,
  status: UserStatus,
  gender?: Maybe<UserGender>,
  dob?: Maybe<Scalars['String']>,
  phone?: Maybe<Scalars['String']>,
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  profileUrl?: Maybe<Scalars['String']>,
  profile?: Maybe<UserProfileDto>,
};

export enum UserGender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER'
}

export type UserProfileDto = {
   __typename?: 'UserProfileDto',
  id: Scalars['Int'],
  work?: Maybe<Scalars['String']>,
  education?: Maybe<Scalars['String']>,
  summary?: Maybe<Scalars['String']>,
  address?: Maybe<AddressDto>,
  addressId?: Maybe<Scalars['Float']>,
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum UserStatus {
  Pending = 'PENDING',
  Active = 'ACTIVE'
}

export type GetTeamsQueryVariables = {
  limit?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>,
  filter?: Maybe<TeamListFilteredDto>
};


export type GetTeamsQuery = (
  { __typename?: 'Query' }
  & { teams: (
    { __typename?: 'TeamPaginationResult' }
    & Pick<TeamPaginationResult, 'count'>
    & { items: Array<(
      { __typename?: 'TeamDto' }
      & Pick<TeamDto, 'id' | 'name' | 'title' | 'ovr' | 'rating' | 'att' | 'def' | 'mid' | 'image' | 'league' | 'leagueId'>
    )> }
  ) }
);

export type GetUsersQueryVariables = {
  limit?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>
};


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id' | 'firstName' | 'lastName' | 'email'>
  )> }
);


export const GetTeamsDocument = gql`
    query getTeams($limit: Int, $skip: Int, $filter: TeamListFilteredDto) {
  teams(limit: $limit, skip: $skip, filter: $filter) {
    items {
      id
      name
      title
      ovr
      rating
      att
      def
      mid
      image
      league
      leagueId
    }
    count
  }
}
    `;

/**
 * __useGetTeamsQuery__
 *
 * To run a query within a React component, call `useGetTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTeamsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, baseOptions);
      }
export function useGetTeamsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, baseOptions);
        }
export type GetTeamsQueryHookResult = ReturnType<typeof useGetTeamsQuery>;
export type GetTeamsLazyQueryHookResult = ReturnType<typeof useGetTeamsLazyQuery>;
export type GetTeamsQueryResult = ApolloReactCommon.QueryResult<GetTeamsQuery, GetTeamsQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers($limit: Int, $skip: Int) {
  users(limit: $limit, skip: $skip) {
    id
    firstName
    lastName
    email
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
      }
export function useGetUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = ApolloReactCommon.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
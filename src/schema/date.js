import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const typedef = `
  scalar Date
`

export const query = `
`

export const mutation = `
`

export const mutationInput = `
`

export const mutationPayload=`
`

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'custom scalar type Date',
        serialize(value){
            return value.getTime();
        },
        parseValue(value){
            return new Date(value);
        },
        parseLiteral(ast){
            if(ast.kind == Kind.INT){
                return new Date(parseInt(ast.value, 10));
            }
            else if(ast.kind == Kind.STRING){
                return new Date(ast.value);
            }
            return null;
        }
    })
}

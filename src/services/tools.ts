
import { queryVectorDB } from '@/services/api';

export async function knowledgeReference({query}: {query: string}){
    console.log("Query passed in as", query)
    const queryResults = await queryVectorDB(query)
    return queryResults.response
}
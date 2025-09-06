import axios from 'axios';
import { resolve } from './resolve.ts';

export const getData = async(url: string) =>{
  return await resolve(axios.get(url).then(res => res.data));
}
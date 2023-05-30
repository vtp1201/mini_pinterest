import { AdvancedError } from '../abstracts';
import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
import https from 'https';

interface Option extends AxiosRequestConfig {
  throwError?: boolean
  jwt?: string
  baseURL?: string
}
const createInstance = (prefix: string, options: Option) => {
  const baseURL = `${options.baseURL}`
  const instanceOption: AxiosRequestConfig = {
    baseURL,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
  }
  if (options.headers) {
    instanceOption.headers = options.headers
  }

  if (options.jwt) {
    if (instanceOption.headers) {
      instanceOption.headers.Authorization = `Bearer ${options.jwt}`
    } else {
      instanceOption.headers = { Authorization: `Bearer ${options.jwt}` }
    }
    return axios.create(instanceOption)
  }
  return axios.create(instanceOption)
}

const checkError = (error: any, prefix: string) => {
  if (error?.response?.data?.code) {
    if (error.response.data.code === 401) {
      throw new AdvancedError({
        unauthorize: {
          kind: 'unauthorize',
          message: 'Session timeout, please login again'
        }
      }, HttpStatusCode.Unauthorized)
    } else {
      throw new AdvancedError(error.response.data)
    }
  }
  console.log(error);

  throw new AdvancedError({
    unknown: {
      kind: "unknown.error",
      message: `There are unknown error from ${prefix}`
    }
  }, HttpStatusCode.InternalServerError)
}


const callAPI = function (prefix: string, options?: Option) {
  const { throwError = true, ...restOptions } = options || {}
  const instance = createInstance(prefix, restOptions)

  return {
    get: async (route: string) => {
      try {
        const { data } = await instance.get(route)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    post: async <P = any, D = any>(route: string, body: P) => {
      try {
        const { data } = await instance.post<D>(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    put: async (route: string, body: {}) => {
      try {
        const { data } = await instance.put(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    patch: async (route: string, body: {}) => {
      try {
        const { data } = await instance.patch(route, body)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    },
    delete: async (route: string) => {
      try {
        const { data } = await instance.delete(route)
        return data
      } catch (error: any) {
        if (throwError) {
          return checkError(error, prefix)
        }
        return error?.response?.data
      }
    }

  }
}
export default callAPI
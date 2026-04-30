import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export function useCartSWR() {
  const { data, error, mutate } = useSWR('/api/cart', fetcher)
  
  const updateCart = async () => {
    mutate() 
  }
  
  return {
    cart: data || { items: [], total: 0 },
    isLoading: !error && !data,
    isError: error,
    updateCart
  }
}
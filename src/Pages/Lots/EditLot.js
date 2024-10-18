import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance'

export default function EditLot() {
    const { lotId } = useParams();
    const [lotInfo, setLotInfo] = useState(null)
    useEffect(async ()=>{
        alert()
        try {
            const response = await axiosInstance.get("/v1/crew/lot/fullInfo", {params: {lotId: lotId}})
            console.log(response)
        }catch (error) {
            console.log(error)
        }
        
    }, [])

  return (
    <div>EditLot</div>
  )
}

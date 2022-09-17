import React from 'react'
import Services from '../components/services/Services'
import SideDrawer from '../components/miscellanous/SideDrawer'
import axios from 'axios'

const Bazar = () => {

    const [offeredServices, setOfferedServices] = React.useState([])
    const [requiredServices, setRequiredServices] = React.useState([])

    async function fetchOfferedServices() {
        const data = await axios.get('/listings-offered-services')
        setOfferedServices(data.data)
    }

    async function fetchRequiredServices() {
        const data = await axios.get('/listings-required-services')
        setRequiredServices(data.data)
    }

    React.useEffect(() => {
        fetchOfferedServices()
        fetchRequiredServices()
    },[])

    return (
    <div className='superContainer'>
        
        <SideDrawer/> 

        <div className='columnsContainer'>

            <div className='offered-services-column'>
                <h1>Offered Services</h1>
                <Services services={offeredServices}/>
            </div>

            <div className='required-services-column'>
                <h1>Required Services</h1>
                <Services services={requiredServices} />
            </div>
        </div>
    </div>
    )
}

export default Bazar
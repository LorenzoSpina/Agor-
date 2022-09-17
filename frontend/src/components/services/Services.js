import React from 'react'
import { Link } from 'react-router-dom'


const Services = (props) => {

    const [posts, setPosts] = React.useState([])

    React.useEffect(() => {
        setPosts(props.services)
    },[props.services])

    const services = posts.map(item => (
        <Link
        to='/service'
        key={item._id}
        state={{
            picture: item.picture,
            id: item._id,
            title: item.title,
            description: item.description,
            place: item.place,
            price: item.price,
            dataRequired: item.dataRequired,
            dataCreation: item.dataCreation,
            lastUpdate: item.lastUpdate,
            user: item.user
        }}
        >
            <div className='serviceImage'>
                <div className='box'>
                    <div className='serviceInformations'>
                        <h2 className='serviceTitle'>{item.title}</h2>
                        <p>Where: {item.place}</p>
                        <p>Data creation: {item.dataCreation.split('T')[0]}</p>
                        {item.dataRequired ? (
                            <p>Data required: {item.dataRequired.split('T')[0]}</p>
                        ) : (
                            <p>Price: {item.price}€</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    ))
    
    return (
    <div>
        {services}
    </div>
    )
}

export default Services
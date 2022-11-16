import React from 'react'

const UserServices = (props) => {

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
            lastUpdate: item.lastUpdate
        }}>
            <div  key={item._id} className='serviceCard'>
            <div  className='serviceImage'>
                <div className='box'>
                    <div className='serviceInformations'>
                        <h2 className='serviceTitle'>{item.title}</h2>
                        <p>Where: {item.place}</p>
                        {item.price ? 
                        (<p>Price: {item.price}€</p>) :
                        (<p>Data required: {item.dataRequired.split('T')[0]}</p>)}
                        <p>Data creation: {item.dataCreation.split('T')[0]}</p>
                    </div>
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

export default UserServices
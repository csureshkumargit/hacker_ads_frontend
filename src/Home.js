import React from "react";
import axios from "axios";
import Modal from "react-modal/lib/components/Modal";
import queryString from "query-string"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',

    },
};
class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            list_ads: [],
            IsModalOpenforAddAds: false,
            ads_statistics: [],
            showStatistics: false,
            Name: '',
            webUrl: '',
            imageUrl: ''
        }
    }
    componentDidMount() {

        axios({
            url: 'http://hackerads-db.herokuapp.com/products',
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }).then((response) => {
            console.log('response', response);
            this.setState({ list_ads: response.data.products })
        }).catch(err => console.log(err))


    }

    addProduct = (e) => {
        e.preventDefault();

        const { Name, webUrl, imageUrl } = this.state;
        const newProduct = {
            Name,
            webUrl,
            imageUrl
        }
        console.log('np', newProduct);
        axios({
            url: 'http://hackerads-db.herokuapp.com/products',
            method: "POST",
            data: newProduct,
            headers: {
                "content-type": "application/json"
            }
        }).then((respose) => { console.log('response', respose); this.setState({ IsModalOpenforAddAds: false }) }).catch(err => console.log(err))

    }

    updatestatisticsCount = (id, webUrl) => {
        const { utm_id } = queryString.parse(webUrl);

        const addinStatistics = {
            id,
            utm_id
        }
        console.log('np', addinStatistics);
        axios({
            url: 'http://hackerads-db.herokuapp.com/statistics',
            method: "PUT",
            data: addinStatistics,
            headers: {
                "content-type": "application/json"
            }
        }).then((respose) => console.log('response', respose)).catch(err => console.log(err))


    }

    showstatisticsCount = () => {
        console.log('hi')
        axios({
            url: 'http://hackerads-db.herokuapp.com/statistics',
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }).then((response) => {
            console.log('response', response);
            this.setState({ ads_statistics: response.data.statistics, showStatistics: true })
        }).catch(err => console.log(err))

    }

    render() {
        const { list_ads, IsModalOpenforAddAds, ads_statistics, showStatistics, Name, webUrl, imageUrl } = this.state;
        return (
            <div>
                <button onClick={() => this.setState({ IsModalOpenforAddAds: true })}>Add Ads</button>
                <button onClick={() => this.showstatisticsCount()}>Show Statistics</button>
                {
                    !showStatistics && list_ads && list_ads.length > 0 && list_ads.map((item) =>
                        <div>
                            <p>{item.Name}</p>
                            <a href={item.webUrl} target="_blank" onClick={() => this.updatestatisticsCount(item._id, item.webUrl)}>
                                <img src={item.imageUrl}
                                    alt={item.Name} /></a>
                        </div>
                    )

                }
                {
                    showStatistics && ads_statistics && ads_statistics.length > 0 && <table style={{ border: "2px" }}><tr><td>ProductID</td><td>UTM_ID</td><td>Count</td></tr>{ads_statistics.map((item) =>
                        <tr>
                            <td>{item.pid}</td>
                            <td>{item.utm_id}</td>
                            <td>{item.count}</td>
                        </tr>

                    )}
                        <button onClick={() => this.setState({ showStatistics: false })}>Hide Statistics</button>
                    </table>
                }
                <Modal
                    isOpen={IsModalOpenforAddAds}
                    style={customStyles}
                    ariaHideApp={true}>
                    <div className="container">
                        <div>Add your Ads</div>
                        <form onSubmit={this.addProduct}>
                            <div>
                                <label>Name :</label>
                                <input type="text" value={Name} onChange={(e) => this.setState({ Name: e.target.value })}
                                    minLength="5" required></input>
                            </div>
                            <div>
                                <label>Website Link :</label>
                                <input type="text" value={webUrl} onChange={(e) => this.setState({ webUrl: e.target.value })}
                                    minLength="10" required></input>
                            </div>
                            <div>
                                <label>Image Link :</label>
                                <input type="text" value={imageUrl} onChange={(e) => this.setState({ imageUrl: e.target.value })}
                                    minLength="10" required></input>
                            </div>
                            <button type="submit">ADD ADS</button>
                            <button type="button" onClick={() => this.setState({ IsModalOpenforAddAds: false })}>CLOSE  ADS</button>
                        </form>
                    </div >
                </Modal >

            </div>
        );
    }
}

export default Home;
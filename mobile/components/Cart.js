import React from 'react';
import {Container, Header, Content, List, ListItem, Thumbnail, Text, Body} from 'native-base';
import firebase from 'react-native-firebase';

const db = firebase.database();

export default class Cart extends React.Component {

  state = {products: {}};

  componentDidMount() {
    db.ref(`products`).once('value')
      .then(snapshot => {
        const val = snapshot.val();
        this.setState({products: val});
      })
  }

  renderProducts(product) {
    return (
      <ListItem key={product.id}>
        <Thumbnail square size={80} source={{uri: product.imageUrl}}/>
        <Body>
        <Text>{product.name}</Text>
        <Text note>{product.description}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    const products = this.state.products;
    const productKeys = Object.keys(products);

    return (
      <Container>
        <Header/>
        <Content>
          <List>
            {productKeys.map(key => this.renderProducts(products[key]))}
          </List>
        </Content>
      </Container>
    );
  }
}

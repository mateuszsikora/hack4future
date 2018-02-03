import React from 'react';
import {Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Title} from 'native-base';
import firebase from 'react-native-firebase';

const db = firebase.database();

export default class Cart extends React.Component {

  state = {products: []};
  products = {};
  beacons = {};

  componentDidMount() {
    db.ref(`products`).once('value')
      .then(snapshot => {
        this.products = snapshot.val();
      });

    db.ref(`beacons`).once('value')
      .then(snapshot => {
        this.beacons = snapshot.val();
      });
  }

  componentWillReceiveProps(nextProps) {
    this.mapHoldsToProducts(nextProps.holds);
  }

  mapHoldsToProducts(holds) {
    const products = Object.keys(holds)
      .map(key => (this.beacons[key] || {}).productId)
      .filter(productId => productId !== undefined)
      .map(productId => this.products[productId]);
    this.setState({products})
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
    return (
      <Container>
        <Header>
          <Body>
            <Title>Cart</Title>
          </Body>
        </Header>
        <Content>
          <List>
            {this.state.products.map(product => this.renderProducts(product))}
          </List>
        </Content>
      </Container>
    );
  }
}

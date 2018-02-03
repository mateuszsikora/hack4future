import React from 'react';
import {Container, Header, Content, Spinner, List, ListItem, Thumbnail, Text, Body, Title} from 'native-base';
import firebase from 'react-native-firebase';

const db = firebase.database();
const centerStyles = {
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
};

const containerStyles = {
  display: 'flex'
};
export default class Cart extends React.Component {

  state = {
    products: [],
    productsFetching: true,
    beaconsFetching: true
  };

  products = {};
  beacons = {};
  inactive = {};

  componentDidMount() {
    db.ref(`products`).once('value')
      .then(snapshot => {
        this.products = snapshot.val();
        this.setState({productsFetching: false});
      });

    db.ref(`beacons`).once('value')
      .then(snapshot => {
        this.beacons = snapshot.val();
        this.setState({beaconsFetching: false});
      });

    db.ref(`inactive`).once('value')
      .then(snapshot => {
        this.inactive = snapshot.val();
      });
  }

  componentWillReceiveProps(nextProps) {
    this.mapHoldsToProducts(nextProps.holds);
  }

  mapHoldsToProducts(holds) {
    const products = Object.keys(holds)
      .filter(key => !this.inactive[key])
      .map(key => (this.beacons[key] || {}).productId)
      .filter(productId => productId !== undefined)
      .map(productId => this.products[productId])
      .sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0
      });
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

  renderList() {
    return (
      <List>
        {this.state.products.map(product => this.renderProducts(product))}
      </List>
    );
  }

  renderNoItems() {
    return (
      <Container style={centerStyles}>
        <Text>No items in your cart</Text>
      </Container>
    );
  }

  renderListOrInfo() {
    return (
      <Container>
        {this.state.products.length > 0 && this.renderList()}
        {this.state.products.length === 0 && this.renderNoItems()}
      </Container>
    );
  }

  renderSpinnger() {
    return (
      <Container style={centerStyles}>
        <Spinner color='blue'/>
      </Container>
    );
  }

  render() {
    return (
      <Container style={containerStyles}>
        <Header>
          <Body>
          <Title>Cart</Title>
          </Body>
        </Header>
        <Content>
          {(!this.state.beaconsFetching && !this.state.productsFetching) && this.renderListOrInfo()}
          {(this.state.beaconsFetching || this.state.productsFetching) && this.renderSpinnger()}
        </Content>
      </Container>
    );
  }
}



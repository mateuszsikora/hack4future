import React from 'react';
import {Text} from 'react-native';
import {Container, Header, Body, Content, Title} from 'native-base';
import {Table, Row, Rows} from 'react-native-table-component';

import {web3, getAccount} from '../web3';
import firebase from 'react-native-firebase';

const db = firebase.database();

export default class PaymentHistory extends React.Component {
  state = {transactions: []};

  componentDidMount() {
    const account = getAccount();
    db.ref(`transactions/${account.address}`)
      .once('value')
      .then(snapshot => {
        const value = snapshot.val() || {};
        const transactions = Object.keys(value).map(key => {
          const transaction = value[key];
          return [transaction.time, transaction.price, key];
        });
        this.setState({transactions});
      });
  }

  render() {
    const tableHead = ['Date', 'Amount', 'Transaction hash'];

    return (
      <Container>
        <Header>
          <Body>
          <Title>Payment history</Title>
          </Body>
        </Header>
        <Content>
          <Table>
            <Row data={tableHead} style={styles.head} textStyle={styles.headText}/>
            <Rows data={this.state.transactions} style={styles.row} textStyle={styles.text}/>
          </Table>
        </Content>
      </Container>
    )
  }
}

const styles = {
  text: {marginLeft: 5},
  row: {height: 30},
  head: {height: 40},
  headText: {color: '#000', textAlign: 'center'},
};

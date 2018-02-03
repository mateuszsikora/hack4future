import React from 'react';
import {Text} from 'react-native';
import {Container, Header, Body, Content, Title} from 'native-base';
import {Table, Row, Rows} from 'react-native-table-component';

export default class PaymentHistory extends React.Component {

  render() {
    const tableHead = ['Head2', 'Head3', 'Head4'];

    const tableData = [
      ['1', '2', '3',],
      ['a', 'b', 'c',],
      ['1', '2', '3',],
      ['a', 'b', 'c',]
    ];

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
            <Rows data={tableData} style={styles.row} textStyle={styles.text}/>
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
  headText: {color: '#000', textAlign: 'center'}
};

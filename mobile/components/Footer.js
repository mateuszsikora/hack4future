import React from 'react';
import {Footer, FooterTab, Text, Button} from 'native-base';
import routes from '../routes';

export default function NavFooter({location, history}) {
  return (
    <Footer>
      <FooterTab>
        <Button
          active={location.pathname === routes.cart}
          onPress={() => location.pathname !== routes.cart && history.push(routes.cart)}
        >
          <Text>Cart</Text>
        </Button>
        <Button
          active={location.pathname === routes.pay}
          onPress={() => location.pathname !== routes.pay && history.push(routes.pay)}
        >
          <Text>Wallet</Text>
        </Button>

        <Button
          active={location.pathname === routes.history}
          onPress={() => location.pathname !== routes.history && history.push(routes.history)}
        >
          <Text>Payment history</Text>
        </Button>
      </FooterTab>
    </Footer>
  )
}

import type { TShopItem } from '@/types';

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Text,
  useToast,
} from '@chakra-ui/react';
import React from 'react';

import { buyShopItem } from '@/axios';

export const ShopItem: React.VFC<{
  item: TShopItem;
  refetch: () => void;
}> = ({ item, refetch }) => {
  const toast = useToast();

  const handleBuy = async () => {
    try {
      const resp = await buyShopItem(item.id);
      if (resp?.success) {
        toast({
          title: '购买成功',
          position: 'top-right',
          status: 'success',
          duration: 1500,
        });
        if (refetch) {
          refetch();
        }
      } else {
        toast({
          title: resp?.message ?? '出错了',
          position: 'top-left',
          status: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={2}>
      <Text>
        <Badge mr={1} colorScheme="green">
          名称：
        </Badge>
        <Badge>{item.name}</Badge>
      </Text>
      <Text>
        <Badge mr={1} colorScheme="green">
          价格：
        </Badge>
        <Badge>{item.price}</Badge>
      </Text>
      <ButtonGroup mt={2}>
        <Button onClick={handleBuy}>购买</Button>
      </ButtonGroup>
    </Box>
  );
};

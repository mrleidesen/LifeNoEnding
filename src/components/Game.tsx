import {
  Button,
  ButtonGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { getUser } from '@/axios/user';
import { MAX_HP } from '@/constance';

import { Course } from './Course';

export const Game: React.VFC = () => {
  const toast = useToast();
  const [timer, setUserTimer] = useState<NodeJS.Timeout | null>(null);
  const { data: user, refetch } = useQuery('user', () => {
    return getUser();
  });

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
      setUserTimer(null);
      toast({
        title: '已经取消定时任务',
        position: 'top-right',
        status: 'warning',
        duration: 1500,
      });
    }
  };

  const setTimer = (func: any, timeout = 3000) => {
    if (timer) {
      clearTimer();
    }

    setUserTimer(
      setInterval(() => {
        func();
      }, timeout)
    );
  };

  if (!user) {
    return null;
  }

  return (
    <Tabs
      isFitted
      defaultIndex={0}
      h="full"
      display="flex"
      flexDirection="column"
      onChange={() => {
        refetch();
      }}
    >
      <TabPanels flex={1} overflowY="auto">
        <TabPanel>
          <Text>名称：{user.name}</Text>
          <Text>
            健康：{user.hp}/{MAX_HP}
          </Text>
          <Text>经验：{user.exp}</Text>
          <Text>金钱：{user.gold}</Text>

          <ButtonGroup mt={4}>
            <Button disabled={!timer} onClick={clearTimer} colorScheme="yellow">
              取消定时任务
            </Button>
          </ButtonGroup>
        </TabPanel>
        <TabPanel>
          <Course
            hasTimer={!!timer}
            setTimer={setTimer}
            clearTimer={clearTimer}
          />
        </TabPanel>
        <TabPanel>
          <Text>工作</Text>
        </TabPanel>
      </TabPanels>
      <TabList flexShrink={0}>
        <Tab>个人信息</Tab>
        <Tab>课程</Tab>
        <Tab>工作</Tab>
      </TabList>
    </Tabs>
  );
};

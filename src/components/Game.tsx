import {
  Badge,
  Button,
  ButtonGroup,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getUser, getUserRest } from '@/axios/user';
import { MAX_HP, SAVE_USER_KEY } from '@/constance';

import { Course } from './Course';
import { Work } from './Work';

export const Game: React.VFC = () => {
  const toast = useToast();
  const [isRest, setIsRest] = useState(false);
  const [timer, setUserTimer] = useState<NodeJS.Timeout | null>(null);
  const [saveTime, setSaveTime] = useState<number>(0);
  const { data: user, refetch } = useQuery('user', () => {
    return getUser();
  });

  const clearTimer = useCallback(() => {
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
  }, [timer, toast]);

  const setTimer = useCallback(
    (func: any, timeout = 3000) => {
      if (timer) {
        clearTimer();
      }

      setUserTimer(
        setInterval(() => {
          func();
        }, timeout)
      );
    },
    [clearTimer, timer]
  );

  const onToggleRest = () => {
    if (isRest && timer) {
      clearTimer();
      setIsRest(false);
      return;
    }
    setIsRest(true);
    setTimer(async () => {
      try {
        const { data, success } = await getUserRest();

        refetch();

        if (!success) {
          toast({
            title: '休息失败',
            description: '已经是满健康',
            duration: 2000,
            status: 'warning',
          });
          return;
        }

        if (data) {
          toast({
            description: `恢复健康值${data.hp}`,
            position: 'top-right',
            status: 'success',
            duration: 1500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  };

  useEffect(() => {
    if (user && user.hp === MAX_HP && isRest && !!timer) {
      clearTimer();
      setIsRest(false);
    }
  }, [clearTimer, isRest, timer, user]);

  useEffect(() => {
    if (user && user.hp <= 0 && timer) {
      clearTimer();
      toast({
        title: '健康值小于0',
        description: '已停止打工，请注意休息',
        duration: null,
        status: 'error',
        position: 'top-left',
        isClosable: true,
      });
    }
  }, [clearTimer, timer, toast, user]);

  useEffect(() => {
    const now = Date.now();
    if (now - saveTime > 1000 * 30 && user) {
      localStorage.setItem(SAVE_USER_KEY, JSON.stringify(user));
      setSaveTime(now);
    }
  }, [saveTime, user]);

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
          <Text>
            <Badge mr={1} colorScheme="green">
              名称：
            </Badge>
            <Badge>{user.name}</Badge>
          </Text>
          <Text>
            <Badge mr={1} colorScheme="green">
              健康：
            </Badge>
            <Badge colorScheme={user.hp < 20 ? 'red' : 'gray'}>
              {user.hp}/{MAX_HP}
            </Badge>
          </Text>
          <Text>
            <Badge mr={1} colorScheme="green">
              经验：
            </Badge>
            <Badge>{user.exp}</Badge>
          </Text>
          <Text>
            <Badge mr={1} colorScheme="green">
              金币：
            </Badge>
            <Badge>{user.gold}</Badge>
          </Text>

          <ButtonGroup mt={4}>
            <Button disabled={!timer} onClick={clearTimer} colorScheme="yellow">
              取消定时任务
            </Button>
            <Button
              colorScheme="green"
              disabled={user.hp >= MAX_HP}
              onClick={onToggleRest}
              isLoading={isRest}
              loadingText="取消休息"
            >
              休息
            </Button>
          </ButtonGroup>

          <h1 className="mt-6">你的目标是赚到100万！</h1>
          <Progress hasStripe value={user.gold} max={1000000} />
        </TabPanel>
        <TabPanel>
          <Course
            hasTimer={!!timer}
            setTimer={setTimer}
            clearTimer={clearTimer}
          />
        </TabPanel>
        <TabPanel>
          <Work
            hasTimer={!!timer}
            setTimer={setTimer}
            clearTimer={clearTimer}
          />
        </TabPanel>
      </TabPanels>
      <TabList flexShrink={0}>
        <Tab>个人信息</Tab>
        <Tab>课程</Tab>
        <Tab>工作</Tab>
        {/* <Tab>商店</Tab> */}
      </TabList>
    </Tabs>
  );
};

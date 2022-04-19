import type { TCourse } from '@/types/course';

import { Box, Button, HStack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getCourseInfo, getCourseList } from '@/axios/course';
import { getUser } from '@/axios/user';

export const Course: React.VFC<{
  hasTimer: boolean;
  setTimer: (func: any, timeout?: number) => void;
  clearTimer: () => void;
}> = ({ hasTimer, setTimer, clearTimer }) => {
  const [learningId, setLearningId] = useState<number>();
  const toast = useToast();
  const { data: list } = useQuery('course', () => {
    return getCourseList();
  });
  const { refetch, data: user } = useQuery('user', () => {
    return getUser();
  });

  useEffect(() => {
    if (!hasTimer) {
      setLearningId(undefined);
    }
  }, [hasTimer]);

  const timerFunc = async (id: number) => {
    try {
      const resp = await getCourseInfo(id);

      if (resp.data) {
        const info = resp.data;
        refetch();
        toast({
          description: `获得经验${info.exp}，健康值受损${info.damage}`,
          position: 'top-right',
          status: 'success',
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onStartLearn = (item: TCourse) => {
    if (learningId === item.id && hasTimer) {
      clearTimer();
      setLearningId(undefined);
      return;
    }

    toast({
      title: `正在学习：${item.name}`,
      description: '已取消上一个任务',
      position: 'top-right',
      duration: 3000,
    });
    setLearningId(item.id);
    setTimer(() => {
      timerFunc(item.id);
    }, item.timeout * 1000);
  };

  if (!list || !user) {
    return null;
  }

  return (
    <Box>
      {list.map((item) => (
        <Box key={item.id} borderWidth="1px" borderRadius="lg" p={2}>
          <Text>课程名：{item.name}</Text>
          <Text>需要经验：{item.limit}</Text>
          <Text>
            每{item.timeout}秒可获得经验：{item.exp.min}-{item.exp.max}
          </Text>
          <Text>
            每{item.timeout}秒会影响健康：{item.damage.min}-{item.damage.max}
          </Text>

          <HStack justify="end">
            <Button
              colorScheme="blue"
              disabled={user.exp < item.limit}
              isLoading={learningId === item.id}
              onClick={() => onStartLearn(item)}
              loadingText="取消学习"
            >
              开始学习
            </Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
};

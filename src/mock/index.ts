import type { TEmployee, TUser } from '@/types';

import Mock from 'mockjs';

type TOptions = {
  body?: string;
};

const Random = Mock.Random;

const User: TUser = {
  name: '',
  gold: 0,
};

const updateUserInfo = (user: Partial<TUser>) => {
  Object.assign(User, user);
};

Mock.mock('/api/user', 'get', () => {
  return User;
});

Mock.mock('/api/user', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');

  updateUserInfo(data);

  return {
    success: true,
  };
});

const UserEmployeeList: TEmployee[] = [];

const EmployeeList: TEmployee[] = [
  {
    id: 1,
    name: '小刘',
    gold: {
      min: 0,
      max: 100,
    },
    damage: { min: 0, max: 2 },
    timeout: 3,
    hp: 100,
    maxHP: 100,
    price: 0,
    total: 0,
  },
  {
    id: 2,
    name: '小张',
    gold: {
      min: 50,
      max: 200,
    },
    damage: { min: 0, max: 3 },
    timeout: 5,
    hp: 100,
    maxHP: 100,
    price: 1000,
    total: 0,
  },
  {
    id: 3,
    name: '小王',
    gold: {
      min: 100,
      max: 350,
    },
    damage: { min: 2, max: 5 },
    timeout: 7,
    hp: 100,
    maxHP: 100,
    price: 5000,
    total: 0,
  },
  {
    id: 4,
    name: '卷仔',
    gold: {
      min: -500,
      max: 1500,
    },
    damage: { min: -5, max: 10 },
    timeout: 5,
    hp: 150,
    maxHP: 150,
    price: 10000,
    total: 0,
  },
  {
    id: 5,
    name: 'Sakura',
    gold: {
      min: 0,
      max: 10000,
    },
    damage: { min: 10, max: 20 },
    timeout: 10,
    hp: 150,
    maxHP: 150,
    price: 100000,
    total: 0,
  },
];

const isEmployeeExsit = (id: number) => {
  return UserEmployeeList.findIndex((item) => item.id === id) !== -1;
};

const updateUserEmployeeList = (
  employee: TEmployee,
  type: 'get' | 'delete' | 'update'
) => {
  const isExsit = isEmployeeExsit(employee.id);

  if (type === 'update') {
    if (isExsit) {
      const index = UserEmployeeList.findIndex(
        (item) => item.id === employee.id
      );
      const oldValue = { ...UserEmployeeList[index] };
      UserEmployeeList[index] = {
        ...oldValue,
        ...employee,
      };
    }
  }
  if (type === 'get') {
    if (!isExsit) {
      UserEmployeeList.push(employee);
    }
  }
  if (type === 'delete') {
    if (isExsit) {
      UserEmployeeList.splice(
        UserEmployeeList.findIndex((item) => item.id === employee.id),
        1
      );
    }
  }
};

Mock.mock('/api/employee/list', 'get', () => {
  return EmployeeList;
});

Mock.mock('/api/employee/user', 'get', () => {
  return UserEmployeeList;
});

Mock.mock('/api/employee/save', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');

  if (data?.list && data.list.length > 0) {
    UserEmployeeList.push(...data.list);
  }

  return {
    success: true,
  };
});

Mock.mock('/api/employee/get', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const employee = EmployeeList.find((item) => item.id === data?.id);

  if (!employee) {
    return {
      success: false,
      message: '没有找到该员工',
    };
  }

  const isExsit = isEmployeeExsit(employee.id);

  if (isExsit) {
    return {
      success: false,
      message: '你已经拥有该员工',
    };
  }
  if (User.gold < employee.price) {
    return {
      success: false,
      message: '金币不足',
    };
  }

  updateUserInfo({
    gold: User.gold - employee.price,
  });

  updateUserEmployeeList(employee, 'get');

  return {
    success: true,
    data: employee,
  };
});

Mock.mock('/api/employee/work', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const employee = UserEmployeeList.find((item) => item.id === data?.id);

  if (!employee) {
    return {
      success: false,
      message: '没有找到该员工',
    };
  }

  const damage = Random.integer(employee.damage.min, employee.damage.max);
  const newHP = employee.hp - damage;
  const deadAlive = newHP <= 0;
  const getGold = deadAlive
    ? Random.integer(-employee.gold.max, employee.gold.max)
    : Random.integer(employee.gold.min, employee.gold.max);

  if (Random.boolean(1, 10, true) && employee.hp < -200) {
    updateUserEmployeeList(employee, 'delete');
    return {
      success: false,
      message: `员工${employee.name}跑路了`,
    };
  }

  updateUserEmployeeList(
    {
      ...employee,
      total: employee.total + getGold,
      hp: newHP,
    },
    'update'
  );
  updateUserInfo({
    gold: User.gold + getGold,
  });

  return {
    success: true,
    data: {
      gold: getGold,
      damage,
    },
  };
});

Mock.mock('/api/employee/rest', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const employee = UserEmployeeList.find((item) => item.id === data?.id);

  if (!employee) {
    return {
      success: false,
      message: '没有找到该员工',
    };
  }
  if (employee.hp === employee.maxHP) {
    return {
      success: false,
      message: '该员工已经满血',
    };
  }

  const heal = Random.integer(1, Math.floor(employee.maxHP / 10));
  const newHP = Math.min(employee.hp + heal, employee.maxHP);
  const deadAlive = newHP <= 0;
  const getGold = deadAlive
    ? Random.integer(-Math.floor(employee.gold.max / 3), 0)
    : 0;

  updateUserEmployeeList(
    {
      ...employee,
      total: employee.total + getGold,
      hp: newHP,
    },
    'update'
  );
  updateUserInfo({
    gold: User.gold + getGold,
  });

  return {
    success: true,
    data: {
      gold: getGold,
      heal,
    },
  };
});

Mock.mock('/api/employee/hospital', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const employee = UserEmployeeList.find((item) => item.id === data?.id);

  if (!employee) {
    return {
      success: false,
      message: '没有找到该员工',
    };
  }
  if (employee.hp > 0) {
    return {
      success: false,
      message: '该员工不需要住院',
    };
  }

  const gold = Math.max(Math.ceil(employee.price / 2), 300);

  updateUserEmployeeList(
    {
      ...employee,
      total: employee.total - gold,
      hp: 1,
    },
    'update'
  );
  updateUserInfo({
    gold: User.gold - gold,
  });

  return {
    success: true,
    message: `${employee.name}已经住院成功，花费了${gold}金币`,
  };
});

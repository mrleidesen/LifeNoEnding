import type { TEmployee, TShopItem, TUser } from '@/types';

import Mock from 'mockjs';

type TOptions = {
  body?: string;
};

const Random = Mock.Random;

const User: TUser = {
  name: '',
  gold: 0,
  achievement: 0,
  employeeCount: 5,
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

const Shop: TShopItem[] = [
  {
    id: 1,
    name: '工位扩展+1',
    price: 300000,
  },
];

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
    name: '双面打工贼',
    gold: {
      min: -2000,
      max: 5000,
    },
    damage: { min: 2, max: 10 },
    timeout: 7,
    hp: 200,
    maxHP: 200,
    price: 50000,
    total: 0,
  },
  {
    id: 6,
    name: '打工王',
    gold: {
      min: 2000,
      max: 4000,
    },
    damage: { min: 5, max: 10 },
    timeout: 7,
    hp: 300,
    maxHP: 300,
    price: 100000,
    total: 0,
  },
  {
    id: 7,
    name: '学Vue的亲戚',
    gold: {
      min: -5000,
      max: 20000,
    },
    damage: { min: 10, max: 20 },
    timeout: 5,
    hp: 100,
    maxHP: 100,
    price: 100000,
    total: 0,
  },
  {
    id: 8,
    name: 'Sakura',
    gold: {
      min: 0,
      max: 15000,
    },
    damage: { min: 10, max: 20 },
    timeout: 10,
    hp: 150,
    maxHP: 150,
    price: 150000,
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
    if (!isExsit && UserEmployeeList.length < User.employeeCount) {
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

Mock.mock('/api/employee/fire', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const employee = UserEmployeeList.find((item) => item.id === data?.id);

  if (!employee) {
    return {
      success: false,
      message: '没有找到该员工',
    };
  }

  updateUserEmployeeList(employee, 'delete');

  return {
    success: true,
  };
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
  if (User.employeeCount <= UserEmployeeList.length) {
    return {
      success: false,
      message: '你的员工数量已经达到上限',
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

  if (Random.boolean(1, 10, true) && employee.hp < -150) {
    updateUserEmployeeList(employee, 'delete');

    if (Random.boolean(1, 10, true)) {
      updateUserInfo({
        gold: User.gold - employee.price * 2,
      });
      return {
        success: false,
        message: `员工${employee.name}对你发起了劳动仲裁，损失${
          employee.price * 2
        }金币`,
      };
    } else {
      return {
        success: false,
        message: `员工${employee.name}跑路了`,
      };
    }
  }

  updateUserEmployeeList(
    {
      ...employee,
      total: employee.total + getGold,
      hp: newHP,
    },
    'update'
  );

  const userGold = User.gold + getGold;
  updateUserInfo({
    gold: userGold,
  });
  if (User.achievement === 0 && userGold >= 1000000) {
    updateUserInfo({
      achievement: 1,
    });
  }

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

Mock.mock('/api/shop', 'get', () => {
  return Shop;
});

Mock.mock('/api/shop/buy', 'post', (options: TOptions) => {
  const data = JSON.parse(options?.body ?? '{}');
  const item = Shop.find((el) => el.id === data?.id);

  if (!item) {
    return {
      success: false,
      message: '没有当前商品',
    };
  }

  if (User.gold < item.price) {
    return {
      success: false,
      message: '金币不足',
    };
  }

  if (item.id === 1) {
    updateUserInfo({
      employeeCount: User.employeeCount + 1,
    });
    return {
      success: true,
    };
  }
});

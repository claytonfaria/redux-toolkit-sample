import {
  createSlice,
  PayloadAction,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { Todo } from 'type';
import { v1 as uuid } from 'uuid';
import logger from 'redux-logger';

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(action.payload);
        // return [...state, action.payload];
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, action: PayloadAction<{ id: string; desc: string }>) => {
      const { payload } = action;
      const todoToEdit = state.find((todo) => todo.id === payload.id);
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }

      // return state.map((todo) =>
      //   todo.id === action.payload.id
      //     ? { ...todo, desc: action.payload.desc }
      //     : todo
      // );
    },
    toggle: (
      state,
      action: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const { payload } = action;
      const todoToToggle = state.find((todo) => todo.id === payload.id);
      if (todoToToggle) {
        todoToToggle.isComplete = payload.isComplete;
      }

      //   return state.map((todo) =>
      //   todo.id === action.payload.id
      //     ? { ...todo, isComplete: action.payload.isComplete }
      //     : todo
      // );
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const { payload } = action;
      return state.filter((todo) => todo.id !== payload.id);
    },
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (_state, action: PayloadAction<{ id: string }>) =>
      action.payload.id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

export default configureStore({
  reducer,
  middleware: [...getDefaultMiddleware(), logger],
  devTools: process.env.NODE_ENV !== 'production',
});

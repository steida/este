/* @flow */
import type { State, Todo } from '../../common/types';
import compose from 'ramda/src/compose';
import isEmpty from 'ramda/src/isEmpty';
import prop from 'ramda/src/prop';
import reverse from 'ramda/src/reverse';
import sortBy from 'ramda/src/sortBy';
import values from 'ramda/src/values';
import React from 'react';
import todosMessages from '../../common/todos/todosMessages';
import { Box, Button, Text } from '../app/components';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { deleteTodo, toggleTodoCompleted } from '../../common/todos/actions';

const itemStyle = {
  inline: true,
  paddingVertical: 0.5,
};

const TodosItem = ({
  deleteTodo,
  todo,
  toggleTodoCompleted,
}) => (
  <Box display="flex">
    <Button
      {...itemStyle}
      bold={false}
      decoration={todo.completed ? 'line-through' : 'none'}
      onClick={() => toggleTodoCompleted(todo)}
      paddingHorizontal={0}
      transform="none"
    >{todo.title}</Button>
    <Button
      {...itemStyle}
      marginHorizontal={0.5}
      onClick={() => deleteTodo(todo.id)}
      paddingHorizontal={0.25}
    >×</Button>
  </Box>
);

type TodosProps = {
  deleteTodo: typeof deleteTodo,
  toggleTodoCompleted: typeof toggleTodoCompleted,
  todos: Object,
};

const Todos = ({
  deleteTodo,
  todos,
  toggleTodoCompleted,
}: TodosProps) => {
  if (isEmpty(todos)) {
    return (
      <Box>
        <FormattedMessage {...todosMessages.empty}>
          {message => <Text>{message}</Text>}
        </FormattedMessage>
      </Box>
    );
  }

  // It's ok and recommended to sort things in view, but for the bigger data
  // leverage reactjs/reselect or bvaughn/react-virtualized.
  const sortedTodos: Array<Todo> = compose(
    reverse,
    sortBy(prop('createdAt')),
    values,
  )(todos);

  return (
    <Box>
      {sortedTodos.map(todo => (
        <TodosItem
          key={todo.id}
          deleteTodo={deleteTodo}
          todo={todo}
          toggleTodoCompleted={toggleTodoCompleted}
        />
      ))}
    </Box>
  );
};

export default connect(
  (state: State) => ({
    todos: state.todos.all,
  }),
  { deleteTodo, toggleTodoCompleted },
)(Todos);

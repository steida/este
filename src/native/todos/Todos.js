/* @flow */
import type { State } from '../../common/types';
import Buttons from './Buttons';
import compose from 'ramda/src/compose';
import isEmpty from 'ramda/src/isEmpty';
import prop from 'ramda/src/prop';
import reverse from 'ramda/src/reverse';
import sortBy from 'ramda/src/sortBy';
import values from 'ramda/src/values';
import React from 'react';
import Todo from './Todo';
import theme from '../app/themes/initial';
import todosMessages from '../../common/todos/todosMessages';
import { CenteredContainer, FormattedMessage } from '../app/components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { toggleTodoCompleted } from '../../common/todos/actions';

const styles = StyleSheet.create({
  empty: {
    color: theme.placeholderTextColor,
    fontSize: theme.fontSizeH5,
  },
  icon: {
    height: 60,
    marginBottom: 10,
    width: 60,
  },
  row: {
    borderBottomColor: theme.separator,
    borderBottomWidth: 1,
    height: 53,
  },
});

const Todos = ({ todos, toggleTodoCompleted }) => {
  if (isEmpty(todos)) {
    return (
      <CenteredContainer>
        <Image
          source={require('./img/EmptyState.png')}
          style={styles.icon}
        />
        <FormattedMessage {...todosMessages.empty} style={styles.empty} />
      </CenteredContainer>
    );
  }

  const sortedTodos = compose(
    reverse,
    sortBy(prop('createdAt')),
    values, // object values to array
  )(todos);

  return (
    <ScrollView>
      {sortedTodos.map(todo =>
        <View key={todo.id} style={styles.row}>
          <Todo todo={todo} toggleTodoCompleted={toggleTodoCompleted} />
        </View>,
      )}
      <Buttons />
    </ScrollView>
  );
};

Todos.propTypes = {
  todos: React.PropTypes.object.isRequired,
  toggleTodoCompleted: React.PropTypes.func.isRequired,
};

export default connect(
  (state: State) => ({
    todos: state.todos.all,
  }),
  { toggleTodoCompleted },
)(Todos);

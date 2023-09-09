import faker, { name } from 'faker';
import { Fragment, PureComponent } from 'react';
import ExampleWrapper from './ExampleWrapper';

class App extends PureComponent {
  state = {
    hasNextPage: true,
    isNextPageLoading: false,
    sortOrder: 'asc',
    items: [],
  };

  constructor(props) {
    super(props);
    faker.seed(123);
    this.persons = new Array(50)
      .fill(true)
      .map(() => ({ name: name.findName() }));
    this.persons.sort((a, b) => a.name.localeCompare(b.name));
  }

  _loadNextPage = (...args) => {
    this.setState({ isNextPageLoading: true }, () => {
      setTimeout(() => {
        this.setState((state) => ({
          hasNextPage: state.items.length < 100,
          isNextPageLoading: false,
          items: [...state.items].concat(
            this.persons.slice(args[0], args[0] + 10),
          ),
        }));
      }, 2500);
    });
  };

  _handleSortOrderChange = (e) => {
    this.persons.sort((a, b) => {
      if (e.target.value === 'asc') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });
    this.setState({
      sortOrder: e.target.value,
      items: [],
    });
  };

  render() {
    const { hasNextPage, isNextPageLoading, items, sortOrder } = this.state;
    return (
      <Fragment>
        <p className="Note">
          This demo app shows how to create a list that automatically loads the
          next "page" of data when a user scrolls close to the end of the list.
        </p>
        <p className="Note">
          该演示应用程序展示了如何创建一个自动加载的列表
          当用户滚动到列表末尾附近时，数据的下一个“页面”。
        </p>
        <select onChange={this._handleSortOrderChange}>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
        <ExampleWrapper
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          items={items}
          sortOrder={sortOrder}
          loadNextPage={this._loadNextPage}
        />

        <p className="Note">
          Check out the documentation to learn more:
          <br />
          <a href="https://github.com/bvaughn/react-window-infinite-loader#documentation">
            github.com/bvaughn/react-window-infinite-loader
          </a>
        </p>
      </Fragment>
    );
  }
}

export default App;

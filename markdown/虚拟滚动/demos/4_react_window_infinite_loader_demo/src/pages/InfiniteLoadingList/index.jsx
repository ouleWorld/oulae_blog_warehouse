import { name } from 'faker';
import { Fragment, PureComponent } from 'react';
import ExampleWrapper from './ExampleWrapper';

class App extends PureComponent {
  state = {
    hasNextPage: true,
    isNextPageLoading: false,
    items: [],
  };

  _loadNextPage = (...args) => {
    /**
     * Q: 为什么在不同的配置下，args 获取的参数会是不同的呢？
     * A:
     * 举例：
     * 在当前例子中，
     * 第 1 页的参数为：[0, 0]
     * 第 2 页的参数为：[10, 10]
     *
     * 在 Home 的例子中
     * 第 1 页的参数为：[0, 24]
     * 第 2 页的参数为：[24, 34]
     *
     * 感觉这个和 InfiniteLoader 的 itemCount 参数有关，不过具体的内容可能还是需要趴一下源码才知道
     */
    console.log('loadNextPage', args);
    this.setState({ isNextPageLoading: true }, () => {
      setTimeout(() => {
        this.setState((state) => ({
          hasNextPage: state.items.length < 40,
          isNextPageLoading: false,
          items: [...state.items].concat(
            new Array(10).fill(true).map(() => ({ name: name.findName() })),
          ),
        }));
      }, 2500);
    });
  };

  render() {
    const { hasNextPage, isNextPageLoading, items } = this.state;

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

        <ExampleWrapper
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          items={items}
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

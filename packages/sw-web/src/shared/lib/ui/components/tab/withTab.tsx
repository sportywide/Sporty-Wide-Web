import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withRouter } from '@web/routes';
import { updateTab } from '@web/shared/lib/ui/components/tab/TabPane';

export function withTabs(getTabs) {
	return WrappedComponent => {
		class NewComponent extends React.Component<any, any> {
			constructor(props) {
				super(props);
				const tabs = getTabs(props);
				const defaultTabIndex = updateTab(tabs, this.props.router.query.tab);
				this.state = {
					activeTabIndex: defaultTabIndex,
				};
			}
			componentDidUpdate(prevProps) {
				const { query } = this.props.router;
				if (query.tab !== prevProps.router.query.tab) {
					const newTab = query.tab;
					const tabs = getTabs(this.props);
					const newActiveIndex = tabs.findIndex(({ name }) => name === newTab);
					this.setState({
						activeTabIndex: newActiveIndex,
					});
				}
			}

			onTabChange = (e, { activeIndex }) => {
				const tabs = getTabs(this.props);
				const selectedTab = tabs[activeIndex];
				const selectedTabName = (selectedTab && selectedTab.name) || 'players';
				updateTab(tabs, selectedTabName);
			}

			render() {
				const tabs = getTabs(this.props);
				return (
					<WrappedComponent
						activeTabIndex={this.state.activeTabIndex}
						tabs={tabs}
						onTabChange={this.onTabChange}
						{...this.props}
					/>
				);
			}
		}

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return withRouter(NewComponent);
	};
}

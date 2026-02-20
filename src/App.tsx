import React, { PropsWithChildren } from 'react';
import './App.scss';
import { Clock } from './components/Clock';

function getRandomName(): string {
  return `Clock-${String(Date.now()).slice(-4)}`;
}

type State = {
  today: Date;
  clockName: string;
  hasClock: boolean;
};

export class App extends React.Component<PropsWithChildren, State> {
  state: State = {
    today: new Date(),
    clockName: 'Clock-0',
    hasClock: true,
  };

  timerToday: ReturnType<typeof setInterval> | null = null;

  timerName: ReturnType<typeof setInterval> | null = null;

  get time(): string {
    return this.state.today.toUTCString().slice(-12, -4);
  }

  startTodayTimer() {
    this.timerToday = window.setInterval(() => {
      this.setState({ today: new Date() }, () => {
        if (this.state.hasClock) {
          // eslint-disable-next-line no-console
          console.log(this.time);
        }
      });
    }, 1000);
  }

  stopTodayTimer() {
    if (this.timerToday) {
      clearInterval(this.timerToday);
      this.timerToday = null;
    }
  }

  handleContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    this.stopTodayTimer();
    this.setState({ hasClock: false });
  };

  handleClick = (): void => {
    if (!this.state.hasClock) {
      this.setState(
        {
          hasClock: true,
          today: new Date(),
        },
        () => {
          this.startTodayTimer();
        },
      );
    }
  };

  componentDidMount(): void {
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleClick);

    this.startTodayTimer();

    this.timerName = window.setInterval(() => {
      this.setState({ clockName: getRandomName() });
    }, 3300);
  }

  componentDidUpdate(_: PropsWithChildren, prevState: State): void {
    if (prevState.clockName !== this.state.clockName && this.state.hasClock) {
      // eslint-disable-next-line no-console
      console.warn(
        `Renamed from ${prevState.clockName} to ${this.state.clockName}`,
      );
    }
  }

  componentWillUnmount(): void {
    this.stopTodayTimer();

    if (this.timerName) {
      clearInterval(this.timerName);
    }

    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('click', this.handleClick);
  }

  render(): React.ReactNode {
    const { hasClock: showClock, clockName } = this.state;

    return (
      <div className="App">
        <h1>React clock</h1>

        {showClock && <Clock name={clockName} time={this.time} />}
      </div>
    );
  }
}

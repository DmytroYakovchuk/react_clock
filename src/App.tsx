import React, { PropsWithChildren } from 'react';
import './App.scss';

function getClockName(): string {
  return `Clock-${String(Date.now()).slice(-4)}`;
}

type State = {
  today: Date;
  clockName: string;
  showClock: boolean;
};

export class App extends React.Component<PropsWithChildren, State> {
  state: State = {
    today: new Date(),
    clockName: 'Clock-0',
    showClock: true,
  };

  timerToday: ReturnType<typeof setInterval> | null = null;

  timerName: ReturnType<typeof setInterval> | null = null;

  get time(): string {
    const d = this.state.today;

    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  startTodayTimer() {
    this.timerToday = window.setInterval(() => {
      this.setState({ today: new Date() }, () => {
        if (this.state.showClock) {
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
    this.setState({ showClock: false });
  };

  handleClick = (): void => {
    if (!this.state.showClock) {
      this.setState(
        {
          showClock: true,
          today: new Date(), // синхронизация с fake clock
        },
        () => {
          this.startTodayTimer(); // таймер стартует заново → без сдвига фаз
        },
      );
    }
  };

  componentDidMount(): void {
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleClick);

    this.startTodayTimer();

    this.timerName = window.setInterval(() => {
      this.setState({ clockName: getClockName() });
    }, 3300);
  }

  componentDidUpdate(_: PropsWithChildren, prevState: State): void {
    if (prevState.clockName !== this.state.clockName && this.state.showClock) {
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
    const { showClock, clockName } = this.state;

    return (
      <div className="App">
        <h1>React clock</h1>

        {showClock && (
          <div className="Clock">
            <strong className="Clock__name">{clockName}</strong>
            {' time is '}
            <span className="Clock__time">{this.time}</span>
          </div>
        )}
      </div>
    );
  }
}

import React, { ErrorInfo } from 'react'
import { Button } from 'antd'

type Props = {
  children: React.ReactElement
};

class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props)
    // eslint-disable-next-line react/no-unused-state
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.log('info', info)
    // eslint-disable-next-line no-console
    console.log('error', error)
    this.setState({
      hasError: true
    })
  }

  render(): React.ReactElement {
    const { children } = this.props
    const { hasError } = this.state
    if (hasError) {
      return (
        <>
          <p>服务端出现了错误，请尝试刷新一下</p>
          <Button
            onClick={(): void => {
              window.location.reload()
            }}
          >
            重新加载
          </Button>
        </>
      )
    }
    return children
  }
}

export default ErrorBoundary

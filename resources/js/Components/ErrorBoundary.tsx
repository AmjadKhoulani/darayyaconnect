import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center" dir="ltr">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl">
                        <h1 className="mb-4 text-3xl font-bold text-red-600">Something went wrong</h1>
                        <p className="mb-6 text-gray-600">The application encountered a critical error and could not render.</p>

                        <div className="mb-6 overflow-auto rounded bg-gray-900 p-4 text-left text-sm text-red-200">
                            <strong>{this.state.error?.toString()}</strong>
                            <pre className="mt-2 text-xs text-gray-500">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="rounded bg-gray-800 px-6 py-2 font-bold text-white hover:bg-black"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

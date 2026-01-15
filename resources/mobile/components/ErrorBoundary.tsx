import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold text-red-600 mb-2">عذراً، حدث خطأ غير متوقع</h1>
                    <p className="text-sm text-gray-500 mb-6">يرجى تصوير هذه الشاشة وإرسالها للمطور</p>

                    <div className="bg-gray-100 p-4 rounded-lg w-full text-left overflow-auto max-h-64 mb-6 shadow-inner border border-gray-200">
                        <code className="text-xs text-red-800 font-mono whitespace-pre-wrap break-all">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </code>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                    >
                        إعادة تشغيل التطبيق
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

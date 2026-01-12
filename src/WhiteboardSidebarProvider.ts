import * as vscode from 'vscode';

/**
 * Sidebar Webview Provider
 * 在左側 Activity Bar 顯示白板快捷入口
 */
export class WhiteboardSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'whiteboard-welcome';

    constructor(private readonly extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        webviewView.webview.html = this.getHtmlContent();

        // 處理來自 webview 的訊息
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'openWhiteboard':
                    await vscode.commands.executeCommand('whiteboard.open');
                    break;
                case 'createWhiteboard':
                    await vscode.commands.executeCommand('whiteboard.createNew');
                    break;
            }
        });
    }

    private getHtmlContent(): string {
        return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            padding: 16px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background: transparent;
        }
        .welcome-section {
            text-align: center;
            margin-bottom: 20px;
        }
        .welcome-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--vscode-foreground);
        }
        .welcome-desc {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 16px;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 10px 16px;
            margin-bottom: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        .btn-primary:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .icon {
            margin-right: 6px;
        }
        .tips {
            margin-top: 20px;
            padding: 12px;
            background: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }
        .tips-title {
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--vscode-foreground);
        }
        .tips ul {
            margin: 0;
            padding-left: 16px;
        }
        .tips li {
            margin-bottom: 4px;
        }
        kbd {
            background: var(--vscode-keybindingLabel-background);
            border: 1px solid var(--vscode-keybindingLabel-border);
            border-radius: 3px;
            padding: 1px 4px;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="welcome-section">
        <div class="welcome-title">📋 Note Whiteboard</div>
        <div class="welcome-desc">視覺化筆記白板</div>
    </div>
    
    <button class="btn btn-primary" onclick="openWhiteboard()">
        <span class="icon">📂</span> 開啟白板
    </button>
    
    <button class="btn btn-secondary" onclick="createWhiteboard()">
        <span class="icon">➕</span> 新增白板
    </button>
    
    <div class="tips">
        <div class="tips-title">快捷鍵</div>
        <ul>
            <li><kbd>Cmd+Shift+1</kbd> 釘選檔案</li>
            <li><kbd>Cmd+Shift+2</kbd> 卡片清單</li>
            <li><kbd>Cmd+Shift+3</kbd> 暫存區</li>
        </ul>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function openWhiteboard() {
            vscode.postMessage({ command: 'openWhiteboard' });
        }
        
        function createWhiteboard() {
            vscode.postMessage({ command: 'createWhiteboard' });
        }
    </script>
</body>
</html>`;
    }
}

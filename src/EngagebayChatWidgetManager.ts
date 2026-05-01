export class EngagebayChatWidgetManager {
    private blinkTimeoutId: any = null;
    private originalTitle: string = "";
    private prefs: any;

    constructor(prefs: any) {
        this.prefs = prefs;
    }

    /**
     * Plays a notification sound from a given URL
     */
    public playSound(soundUrl: string): void {
        try {
            // Fix: Only play if soundUrl is provided
            if (!soundUrl) return;

            const audio = new Audio(soundUrl);
            audio.play();
        } catch (error) {
            console.error("Error playing notification sound:", error);
        }
    }

    /**
     * Blinks the browser tab title to get user attention
     */
    public blinkTitle(message: string): void {
        const clear = () => {
            if (this.blinkTimeoutId) {
                clearInterval(this.blinkTimeoutId);
                this.blinkTimeoutId = null;
            }
            if (this.originalTitle) {
                document.title = this.originalTitle;
            }
        };

        clear();
        this.originalTitle = document.title;

        this.blinkTimeoutId = setInterval(() => {
            document.title = document.title === message ? this.originalTitle : message;
        }, 1000);

        // Stop blinking when user focuses back on the window
        window.onfocus = () => {
            clear();
        };
    }

    /**
     * Resizes the chat widget container based on the state
     */
    public resize(type: string): void {
        (window as any).EhLog?.log("resize", type);

        const iframeParent: HTMLElement | null = document.querySelector(
            `.engagebay-chat-widget[data-id='${this.prefs.id}']`
        );

        if (!iframeParent) return;

        iframeParent.removeAttribute('style');
        
        const iframe = iframeParent.getElementsByTagName("iframe")[0];
        let frameDocument: any = (iframe.contentWindow || iframe.contentDocument);
        frameDocument = frameDocument.document || frameDocument;

        if (type === "WINDOW_CLOSED") {
            iframeParent.style.setProperty("height", "100px", "important");
            iframeParent.style.setProperty("width", "100px", "important");
        } 
        else if (type === "PROMPT_OPENED" || type === "WINDOW_OPENED_LARGE") {
            if (type === "WINDOW_OPENED_LARGE") {
                iframeParent.style.setProperty("width", "730px", "important");
            }

            setTimeout(() => {
                if (type === "WINDOW_OPENED_LARGE") {
                    iframeParent.style.setProperty("width", "730px", "important");
                }
                const promptEl = frameDocument.getElementsByClassName("chat__prompt")[0];
                if (promptEl) {
                    const frameheight = promptEl.scrollHeight;
                    iframeParent.style.height = (frameheight + 180) + "px";
                }
            }, 200);
        } 
        else if (type === "LIVECHAT_WRAPPER_CLOSED") {
            iframeParent.style.setProperty("height", "0px", "important");
            iframeParent.style.setProperty("width", "0px", "important");
        }

        // Check mobile helper function (assumed global)
        if (typeof (window as any).eh_is_mobile_browser === 'function' && (window as any).eh_is_mobile_browser()) {
            frameDocument.getElementsByClassName("chat__main")[0]?.classList.add("chat__mobile");
        }
    }
}
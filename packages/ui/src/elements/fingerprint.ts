import { randomArt } from "@padlock/core/lib/randomart.js";
import { getProvider } from "@padlock/core/lib/crypto.js";
import { svg } from "lit-html";
import { BaseElement, html, element, property } from "./base";

@element("pl-fingerprint")
export class Fingerprint extends BaseElement {
    @property()
    key: string = "";

    private async _grid() {
        const size = 11;
        const fingerprint = await getProvider().fingerprint(this.key);
        const art = randomArt(fingerprint, { width: size, height: size });
        const rects = [];
        for (const [x, line] of art.values.entries()) {
            for (const [y, val] of line.entries()) {
                rects.push(svg`<rect x="${x}" y="${y}" width="1" height="1" opacity="${val / 10}" />`);
            }
        }
        return svg`
            <svg viewBox="0 0 ${size} ${size}">
                ${rects}
            </svg>
        `;
    }

    shouldUpdate() {
        return !!this.key;
    }

    render() {
        return html`
            <style>
                :host {
                    display: block;
                    width: 100px;
                    height: 100px;
                    position: relative;
                    overflow: hidden;
                    background: var(--color-background);
                    color: var(--color-foreground);
                }

                svg {
                    width: 100%;
                    height: 100%;
                    fill: currentColor;
                }
            </style>

            ${this._grid()}
        `;
    }
}

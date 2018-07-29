import { Accessor, Invite } from "@padlock/core/lib/crypto.js";
import { localize as $l } from "@padlock/core/lib/locale.js";
import { app } from "../init.js";
import sharedStyles from "../styles/shared.js";
import { BaseElement, element, html, property } from "./base.js";

@element("pl-account-item")
export class AccountItem extends BaseElement {
    @property() account: Accessor | null = null;
    @property() invite: Invite | null = null;

    _shouldRender() {
        return !!this.account;
    }

    _render({ account, invite }: this) {
        account = account!;
        let pills = [];

        if (invite) {
            pills.push({ icon: "time", label: $l("invited by {0}", invite.sender.email) });
        }

        if (app.isTrusted(account)) {
            pills.push({ icon: "trusted", label: $l("trusted") });
        }

        if (!invite && account.permissions) {
            account.permissions.read && pills.push({ icon: "check", label: $l("read") });
            account.permissions.write && pills.push({ icon: "check", label: $l("write") });
            account.permissions.manage && pills.push({ icon: "check", label: $l("manage") });
        }

        if (!account.permissions) {
            pills.push(
                ...app.sharedStores.filter(s => s.accessors.some(a => a.email === account!.email)).map(s => {
                    return {
                        icon: "group",
                        label: s.name
                    };
                })
            );
        }

        return html`
            <style>
                ${sharedStyles}

                :host {
                    height: 80px;
                    display: flex;
                    align-items: center;
                }

                pl-fingerprint {
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                    border: solid 1px var(--border-color);
                    margin: 15px;
                }

                .account-info {
                    flex: 1;
                    width: 0;
                }

                .account-email {
                    font-weight: bold;
                    margin-bottom: 5px;
                    @apply --ellipsis;
                }
            </style>

            <pl-fingerprint key="${account.publicKey}"></pl-fingerprint>

            <div class="account-info">

                <div class="account-email">${account.email}</div>

                <div class="stats">

                    ${pills.map(
                        pill => html`
                            <div class="stat">

                                <pl-icon icon="${pill.icon}"></pl-icon>

                                <div>${pill.label}</div>

                            </div>`
                    )}

                </div>

            </div>
        `;
    }
}
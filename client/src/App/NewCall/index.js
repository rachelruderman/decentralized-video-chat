import React from 'react'
import { useHistory } from 'react-router-dom';

export const NewCall = () => {
    const history = useHistory();

    return (
        <main className="site-content">
            <section className="hero section illustration-section-01">
                <div className="container">
                    <div className="hero-inner section-inner">
                        <div className="split-wrap invert-mobile">
                            <div className="split-item">
                                <div
                                    className="hero-content split-item-content center-content-mobile"
                                >
                                    <h1
                                        className="mt-0 mb-16 reveal-from-bottom"
                                        data-reveal-delay="150"
                                    >
                                        Pick name. <br />
                      Share URL. <br />
                      Start chatting.
                    </h1>
                                    <p
                                        className="mt-0 mb-32 reveal-from-bottom"
                                        data-reveal-delay="300"
                                    >
                                        Each chat has its own disposable URL. Just pick a call
                                        name and share your custom link. It's really that easy.
                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta section center-content-mobile reveal-from-bottom">
                <div className="container">
                    <div className="cta-inner section-inner cta-split">
                        <div className="cta-slogan">
                            <h3 className="m-0">
                                Pick a call name.<br />
                  How about this one?
                </h3>
                        </div>
                        <div className="cta-action">
                            <div className="mb-24">
                                <label className="form-label screen-reader" for="input-01"
                                >This is a label</label
                                >
                                <div className="form-group-desktop">
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="input-01"
                                        value="PurpleSquid"
                                    />
                                    <button
                                        className="button button-primary pulse"
                                        onClick={() => history.push(`/join/${document.getElementById('input-01').value}`)}
                                    >
                                        Go To My Call
                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
import React, { FC, useContext, useEffect, useState } from "react";
import CollectionHeader from "./CollectionHeader";
import ArticleItem from "./ArticleItem";
import {
  HC_ACTIVE_ID,
  HC_ACTIVE_COMPONENT,
  KB_COLLECTION_URL_PATH_BY_ID,
} from "../globals";

import { getReq } from "../request";
import { getSessionStoragePrefs, removeSessionStoragePrefs } from "../Storage";
import { AppContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { widgetFooterTabs } from "../App";
import { CollectionType, SectionType } from "../Models";

export interface CollectionComponentProps {
  collection: CollectionType | undefined;
  openArticle: (articleId: Number) => void;
  backToCollectionList: () => void;
  setCollection: (arg0: CollectionType) => void;
}

const Collection: FC<CollectionComponentProps> = (props) => {
  const parentContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const { collection, openArticle, backToCollectionList, setCollection } =
    props;

  useEffect(() => {
    if (!collection) {
      const wait = getReq(
        KB_COLLECTION_URL_PATH_BY_ID + getSessionStoragePrefs(HC_ACTIVE_ID),
        {}
      );
      wait
        .then((response) => {
          setLoading(false);

          if (
            !response.data ||
            !response.data.id ||
            !response.data.articles ||
            response.data.articles.length == 0
          ) {
            removeSessionStoragePrefs(HC_ACTIVE_COMPONENT);
            removeSessionStoragePrefs(HC_ACTIVE_ID);
            parentContext.changeActiveTab(widgetFooterTabs.Help);
          }

          setCollection(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else setLoading(false);
  }, []);

  return (
    <div className="overflow___hiiden">
      <div className="chat__help chat__help-article">
        <div className="chat__conversation chat__create-ticket">
          <div className="chat__header">
            <div className="ticket__header-action">
              <div className="chat__help-action">
                <div
                  data-trigger="all"
                  className="chat__header-back"
                  onClick={() => backToCollectionList()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    color="currentColor"
                  >
                    <path
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                      d="m14 18-6-6 6-6"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="chat__help-user">
                <h3 className="chat__help-user-name">Help </h3>
              </div>
              <div className="chat__help-end">
                <CloseWidgetPanel />
              </div>
            </div>
          </div>

          <div className="help__collections help__collections-list-items">
            {loading ? (
              <div className="pad-content">
                <div className="chat__form-loader1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <>
                {collection && collection.articles && (
                  <CollectionHeader
                    articles={collection.articles}
                    authors={collection.authors}
                    title={collection.title}
                    description={collection.description}
                  />
                )}
                <ul className="help__collections-list">
                  {collection &&
                    collection.section_list &&
                    collection.section_list.map((section) =>
                      section.default_section ? (
                        section.articles &&
                        section.articles.map(
                          (article) =>
                            article.status == "PUBLISHED" && (
                              <ArticleItem
                                article={article}
                                openArticle={openArticle}
                              />
                            )
                        )
                      ) : section.articles.length > 0 ? (
                        <>
                          <h5 className="setction_name">{section.name}</h5>
                          {section.articles.map(
                            (article) =>
                              article.status == "PUBLISHED" && (
                                <ArticleItem
                                  article={article}
                                  openArticle={openArticle}
                                />
                              )
                          )}
                        </>
                      ) : (
                        <></>
                      )
                    )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;

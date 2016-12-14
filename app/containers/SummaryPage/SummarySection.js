import React, { PropTypes } from 'react';
import cuid from 'cuid';

const ItemList = ({ items }) => (
  <ul>
    {items.map(({ vocabulary }) => (
      <li key={cuid()} className="vocab-card">
        <div className="vocab-base">
          {/* FIXME: need pk id on vocab coming from review endpoint
            to create <Link to=`/vocabulary/${vocabulary.pkid}` />*/}
          <a href="#vocabitem" className="readingset">
            <div className="ja">
              {vocabulary.readings.map(({ kana, character }) => (
                <span key={cuid()}>
                  <span lang="ja" className="kana">{ kana }</span>
                  <span lang="ja" className="kanji">{ character }</span>
                </span>
                ))}
            </div>
            <div className="meaning">{ vocabulary.meaning }</div>
          </a>
        </div>
      </li>
    ))}
  </ul>
);

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
};

const PlaceHolder = ({ correct }) => (
  // this is flipped because we want to show this in relation to the opposing section
  !correct ?
    <h3 className="title"><span lang="ja">完璧だ！</span> (๑•̀ㅂ•́)و</h3> :
    <h3 className="title"><span lang="ja">残念だよ</span> (๑◕︵◕๑)</h3>
);

PlaceHolder.propTypes = {
  correct: PropTypes.bool.isRequired,
};

const SummarySection = ({ items, correct }) => (
  <section>
    <h2 className="title">{`${items.length} ${correct ? 'Correct' : 'Incorrect'}`}</h2>
    { items.length ? <ItemList items={items} /> : <PlaceHolder correct={correct} /> }
  </section>
);


SummarySection.propTypes = {
  items: PropTypes.array.isRequired,
  correct: PropTypes.bool.isRequired,
};

export default SummarySection;

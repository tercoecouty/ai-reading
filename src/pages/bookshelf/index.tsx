import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { user } from "@api/index";
import Header from "@component/Header/index";
import bookCover01Img from "./book-cover-01.jpg";
import styles from "./index.less";

function Bookshelf() {
    const [books, setBooks] = useState<user.IBook[]>([]);

    useEffect(() => {
        user.getBooks().then((bookList) => setBooks(bookList));
        let img = bookCover01Img;
    }, []);

    function showBooks() {
        return books.map((book, index) => {
            const { bookCoverUrl, bookName, bookId } = book;
            return (
                <div className={styles.bookItem} key={index}>
                    <img src={bookCoverUrl} data-book-id={bookId} />
                    <div>{bookName}</div>
                </div>
            );
        });
    }

    function handleClickBook(e) {
        if (!e.target) return;

        const bookId = e.target.getAttribute("data-book-id");
        if (!bookId) return;

        window.location.href = `./reader.html?bookId=${bookId}`;
    }

    return (
        <React.Fragment>
            <Header showHomework />
            <div className={styles.bookList} onClick={handleClickBook}>
                {showBooks()}
            </div>
        </React.Fragment>
    );
}

render(<Bookshelf />, document.getElementById("root"));

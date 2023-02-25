import styles from './style.module.scss'
import logo from '../../../public/logo.png'
import Link from 'next/link';
import { useEffect, useContext } from 'react';
import {AuthContext} from '../../context/AuthContext'
import Image from 'next/image';
import {setupApi} from '../../services/api'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BsCart } from "react-icons/bs";
import {FiLogOut} from 'react-icons/fi'



export function Header(){
  const {user, signOut} = useContext(AuthContext)
    return(
        <header className={styles.headerContainer}>
    <Navbar bg="light" expand="lg">
      <Container>
       
        <Navbar.Brand href="/">
            <Image src={logo} alt="img-logo" width={100}/>
        </Navbar.Brand>
       
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/sobre">Sobre Nós</Nav.Link>

            {user &&(
          <button className={styles.cart}>
            <Link href='/cart'>
            <BsCart size={30} color='#000'/>
            <span>Meu Carrinho</span>
            </Link>
          </button>
        )}

          {user?.isAdmin &&(
          <button className={styles.dashboard}>
            <Link href='/category'>
            <span>Criar Categoria</span>
            </Link>
          </button>
        )}
            {user?.isAdmin &&(
          <button className={styles.dashboard}>
            <Link href='/product'>
            <span>Cadastrar produto</span>
            </Link>
          </button>

        )}
        {user ? (
            <button  onClick={signOut} className={styles.btnIcon}>
              <FiLogOut color="#000" size={22}/>
          </button>
        ) : (
          <button  className={styles.Btn}>
          <Link href='/login'>
          <span>Fazer login</span>
          </Link>
        </button>
        )}
          </Nav>
        </Navbar.Collapse>
       
      </Container>
    </Navbar>
         
        </header>
    )
}

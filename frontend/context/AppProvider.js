import providers from './providers'
import React from 'react'

export default ({ children }) => {
    let result = children
    providers.forEach(Wrapper => result = <Wrapper>{result}</Wrapper>)
    return result
}
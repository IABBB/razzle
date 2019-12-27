import styled from 'styled-components';

const StyledHome = styled.div`
  text-align: center;
`;

StyledHome.Header = styled.div`
  height: 150px;
  padding: 20px;
  h2 {
    font-size: 1.2em;
  }
`;
StyledHome.Intro = styled.pre`
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 25px;
  overflow-x: auto;
  font-size: 0.9em;
`;
StyledHome.ResourcesList = styled.ul`
  list-style: none;
  > li {
    display: inline-block;
    padding: 1rem;
  }
`;
StyledHome.LogoImg = styled.img`
  height: 80px;
`;
StyledHome.LocaleSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export default StyledHome;

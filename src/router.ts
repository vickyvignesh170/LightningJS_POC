import { Utils } from "@lightningjs/sdk";
import { MoviePlayer } from "./components/MoviePlayer";
import { Home } from "./components/Home";

export default {
  root: 'frames',
    routes: [
      {
        path: 'frames',
        component: Home,
        on: async (page: any) => {
          fetch(Utils.asset('response.json'))
          .then(res => res.json())
          .then(res => { 
            page.MyImageLists = res;
            page.Content.update(res);
            return true;
          })
          .catch(err => console.error(err));
        },
        widgets: ['Menu', 'FilterBy']
      },
      {
        path: 'movieplayer/:id',
        component: MoviePlayer,
        on: async (page: any, {id}) => {
          fetch(Utils.asset('response.json'))
          .then(res => res.json())
          .then(res => { 
            const [selected] =  res.filter((movie: any) => movie.id == id);
            page.selectedMovie = selected;
            page.allMoviesList = res;
            page.update();     
            return true;
          })
          .catch(err => console.error(err));
        }
      }
    ],
  }
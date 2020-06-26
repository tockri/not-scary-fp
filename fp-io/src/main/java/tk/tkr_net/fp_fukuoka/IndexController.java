package tk.tkr_net.fp_fukuoka;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/")
public class IndexController {
    @GetMapping("")
    public String root() {
        return "index.html";
    }    
}
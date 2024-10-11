package licenta.retrievedata.controllers;


import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.repositories.UserRepository;
import licenta.retrievedata.services.ClientService;
import licenta.retrievedata.services.DeviceService;
import licenta.retrievedata.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {


    @Autowired
    private ClientService clientService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private UserService userService;


    @GetMapping("/types")
    public List<String> getDeviceTypes(){
        return clientService.getDeviceTypes();
    }


    @GetMapping
    public List<Device> getFilteredDevices(@RequestParam(required = false) String category,
                                           @RequestParam(required = false, defaultValue = "0") double minPrice,
                                           @RequestParam(required = false, defaultValue = "1000") double maxPrice) {
        return deviceService.getFilteredDevices(category, minPrice, maxPrice);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }




}
